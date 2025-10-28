import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useComplexes } from '@/hooks/useComplexes';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Shield, Users, Plus, Edit, Building2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { z } from 'zod';
interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface ComplexInfo {
  id: string;
  name: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const { complexes: complexesList, addComplex, deleteComplex } = useComplexes();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [complexes, setComplexes] = useState<ComplexInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedComplexes, setSelectedComplexes] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('user');
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithRole | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Complex creation states
  const [createComplexDialogOpen, setCreateComplexDialogOpen] = useState(false);
  const [newComplexId, setNewComplexId] = useState('');
  const [newComplexName, setNewComplexName] = useState('');
  const [newComplexLocation, setNewComplexLocation] = useState('');
  const [newComplexDescription, setNewComplexDescription] = useState('');
  const [newComplexImage, setNewComplexImage] = useState('');
  const [newComplexCommissionType, setNewComplexCommissionType] = useState<'fixed' | 'percentage'>('percentage');
  const [newComplexCommissionValue, setNewComplexCommissionValue] = useState('0');
  const [creatingComplex, setCreatingComplex] = useState(false);

  const newUserSchema = z.object({
    email: z.string().trim().email({ message: 'Email invalid' }).max(255),
    password: z.string().min(6, { message: 'Parola trebuie să aibă minim 6 caractere' }).max(128),
    fullName: z.string().trim().max(120).optional(),
    role: z.enum(['user', 'manager', 'admin'])
  });

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      navigate('/');
      toast.error('Nu aveți acces la această pagină');
    }
  }, [profile, authLoading, navigate]);

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles = profilesData.map(profile => ({
        ...profile,
        role: rolesData.find(r => r.user_id === profile.id)?.role || 'user',
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Eroare la încărcarea utilizatorilor');
    }
  };

  const fetchComplexes = async () => {
    try {
      const { data, error } = await supabase
        .from('complexes')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setComplexes(data || []);
    } catch (error) {
      console.error('Error fetching complexes:', error);
      toast.error('Eroare la încărcarea complexurilor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchComplexes();
  }, []);

  const openEditDialog = async (user: UserWithRole) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setEditEmail(user.email);
    setEditPassword('');

    try {
      const { data, error } = await supabase
        .from('user_complex_access')
        .select('complex_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSelectedComplexes(data.map(d => d.complex_id));
    } catch (error) {
      console.error('Error fetching user access:', error);
    }

    setDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setUpdating(true);
    try {
      // Update email and/or password if changed
      if (editEmail !== selectedUser.email || editPassword) {
        const updateData: { email?: string; password?: string } = {};
        if (editEmail !== selectedUser.email) {
          updateData.email = editEmail;
        }
        if (editPassword) {
          if (editPassword.length < 6) {
            toast.error('Parola trebuie să aibă minim 6 caractere');
            setUpdating(false);
            return;
          }
          updateData.password = editPassword;
        }

        const { error: authError } = await supabase.functions.invoke('update-user', {
          body: { 
            userId: selectedUser.id,
            ...updateData
          },
        });

        if (authError) {
          throw new Error((authError as any).message || 'Eroare la actualizarea credențialelor');
        }
      }

      // Update role
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: selectedRole as 'user' | 'manager' | 'admin' })
        .eq('user_id', selectedUser.id);

      if (roleError) throw roleError;

      // Delete existing access
      const { error: deleteError } = await supabase
        .from('user_complex_access')
        .delete()
        .eq('user_id', selectedUser.id);

      if (deleteError) throw deleteError;

      // Insert new access
      if (selectedComplexes.length > 0) {
        const { error: insertError } = await supabase
          .from('user_complex_access')
          .insert(
            selectedComplexes.map(complexId => ({
              user_id: selectedUser.id,
              complex_id: complexId,
            }))
          );

        if (insertError) throw insertError;
      }

      toast.success('Utilizator actualizat cu succes');
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la actualizarea utilizatorului');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      default:
        return 'User';
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('Email și parola sunt obligatorii');
      return;
    }

    setCreating(true);
    try {
      const payload = newUserSchema.parse({
        email: newUserEmail,
        password: newUserPassword,
        fullName: newUserFullName || undefined,
        role: newUserRole as 'user' | 'manager' | 'admin',
      });

      const { data, error } = await supabase.functions.invoke('create-user', {
        body: payload,
      });

      if (error) {
        throw new Error((error as any).message || 'Eroare la crearea utilizatorului');
      }

      toast.success('Utilizator creat cu succes');
      setCreateDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserFullName('');
      setNewUserRole('user');
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la crearea utilizatorului');
    } finally {
      setCreating(false);
    }
  };

  const openDeleteDialog = (user: UserWithRole) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.id },
      });

      if (error) {
        throw new Error((error as any).message || 'Eroare la ștergerea utilizatorului');
      }

      toast.success('Utilizator șters cu succes');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la ștergerea utilizatorului');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateComplex = async () => {
    if (!newComplexId || !newComplexName || !newComplexLocation) {
      toast.error('ID, nume și locație sunt obligatorii');
      return;
    }

    setCreatingComplex(true);
    try {
      await addComplex({
        id: newComplexId,
        name: newComplexName,
        location: newComplexLocation,
        description: newComplexDescription,
        image: newComplexImage,
        commission_type: newComplexCommissionType,
        commission_value: parseFloat(newComplexCommissionValue) || 0,
      });

      toast.success('Complex creat cu succes');
      setCreateComplexDialogOpen(false);
      setNewComplexId('');
      setNewComplexName('');
      setNewComplexLocation('');
      setNewComplexDescription('');
      setNewComplexImage('');
      setNewComplexCommissionType('percentage');
      setNewComplexCommissionValue('0');
      fetchComplexes();
    } catch (error) {
      console.error('Error creating complex:', error);
    } finally {
      setCreatingComplex(false);
    }
  };

  const handleDeleteComplex = async (complexId: string) => {
    if (!confirm('Sigur doriți să ștergeți acest complex? Această acțiune nu poate fi anulată.')) {
      return;
    }

    try {
      await deleteComplex(complexId);
      fetchComplexes();
    } catch (error) {
      console.error('Error deleting complex:', error);
    }
  };

  if (authLoading || loading) {
    return <div>Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-info rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panou Administrare</h1>
                <p className="text-sm text-muted-foreground">Gestionează utilizatori și permisiuni</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Utilizatori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administratori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Complexe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">{complexes.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  Utilizatori
                </CardTitle>
                <CardDescription className="mt-1">
                  Gestionează rolurile și accesul utilizatorilor la complexe
                </CardDescription>
              </div>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Utilizator Nou
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Nume</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Rol</TableHead>
                    <TableHead className="font-semibold text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Niciun utilizator găsit
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          {user.full_name || <span className="text-muted-foreground italic">Fără nume</span>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="font-medium">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                              Editează
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(user)}
                              className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              disabled={user.id === profile?.id}
                            >
                              <Trash2 className="h-3 w-3" />
                              Șterge
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Creează utilizator nou
              </DialogTitle>
              <DialogDescription>
                Adaugă un utilizator nou în sistem cu credențiale și rol
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="email@exemplu.ro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Parolă *</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Minimum 6 caractere"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-fullname">Nume complet</Label>
                <Input
                  id="new-fullname"
                  type="text"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="Ion Popescu"
                />
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User (vizualizare)</SelectItem>
                    <SelectItem value="manager">Manager (editare)</SelectItem>
                    <SelectItem value="admin">Admin (acces complet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={handleCreateUser} disabled={creating} className="gap-2">
                {creating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Se creează...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Creează Utilizator
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Șterge utilizator
              </DialogTitle>
              <DialogDescription>
                Ești sigur că vrei să ștergi utilizatorul{' '}
                <span className="font-medium text-foreground">{userToDelete?.email}</span>?
                Această acțiune este permanentă și nu poate fi anulată.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                Anulează
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={deleting}
                className="gap-2"
              >
                {deleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Se șterge...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Șterge utilizator
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Editează utilizator
              </DialogTitle>
              <DialogDescription>
                Modifică rolul și accesul la complexe pentru{' '}
                <span className="font-medium text-foreground">{selectedUser?.email}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="edit-email" className="text-base font-semibold">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="email@exemplu.ro"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="edit-password" className="text-base font-semibold">
                  Parolă nouă (opțional)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Lasă gol pentru a păstra parola actuală"
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 caractere. Lasă câmpul gol dacă nu vrei să schimbi parola.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Rol utilizator</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <div>
                          <div className="font-medium">User</div>
                          <div className="text-xs text-muted-foreground">Doar vizualizare</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Manager</div>
                          <div className="text-xs text-muted-foreground">Vizualizare și editare</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Admin</div>
                          <div className="text-xs text-muted-foreground">Acces complet</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRole !== 'admin' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Acces la complexe</Label>
                    <Badge variant="outline" className="text-xs">
                      {selectedComplexes.length} / {complexes.length}
                    </Badge>
                  </div>
                  <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto bg-muted/30">
                    {complexes.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Niciun complex disponibil
                      </p>
                    ) : (
                      complexes.map((complex) => (
                        <div key={complex.id} className="flex items-center space-x-3 p-2 rounded hover:bg-background transition-colors">
                          <Checkbox
                            id={complex.id}
                            checked={selectedComplexes.includes(complex.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedComplexes([...selectedComplexes, complex.id]);
                              } else {
                                setSelectedComplexes(
                                  selectedComplexes.filter((id) => id !== complex.id)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={complex.id} className="cursor-pointer flex-1 font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {complex.name}
                            </div>
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Administratorii au acces complet la toate complexele
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={updating}>
                Anulează
              </Button>
              <Button onClick={handleSaveUser} disabled={updating} className="gap-2">
                {updating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Se actualizează...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Salvează Modificările
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Complexes Table */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-5 w-5 text-primary" />
                  Complexe
                </CardTitle>
                <CardDescription className="mt-1">
                  Gestionează complexurile rezidențiale
                </CardDescription>
              </div>
              <Button 
                onClick={() => setCreateComplexDialogOpen(true)}
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Complex Nou
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nume</TableHead>
                    <TableHead className="font-semibold">Locație</TableHead>
                    <TableHead className="font-semibold text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complexesList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Niciun complex găsit
                      </TableCell>
                    </TableRow>
                  ) : (
                    complexesList.map((complex) => (
                      <TableRow key={complex.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm text-muted-foreground">{complex.id}</TableCell>
                        <TableCell className="font-medium">{complex.name}</TableCell>
                        <TableCell className="text-muted-foreground">{complex.location}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteComplex(complex.id)}
                            className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Șterge
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Complex Dialog */}
        <Dialog open={createComplexDialogOpen} onOpenChange={setCreateComplexDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Creează complex nou
              </DialogTitle>
              <DialogDescription>
                Adaugă un complex rezidențial nou în sistem
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="complex-id">ID Complex *</Label>
                <Input
                  id="complex-id"
                  value={newComplexId}
                  onChange={(e) => setNewComplexId(e.target.value)}
                  placeholder="complex-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complex-name">Nume *</Label>
                <Input
                  id="complex-name"
                  value={newComplexName}
                  onChange={(e) => setNewComplexName(e.target.value)}
                  placeholder="Numele complexului"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complex-location">Locație *</Label>
                <Input
                  id="complex-location"
                  value={newComplexLocation}
                  onChange={(e) => setNewComplexLocation(e.target.value)}
                  placeholder="București, România"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complex-description">Descriere</Label>
                <Textarea
                  id="complex-description"
                  value={newComplexDescription}
                  onChange={(e) => setNewComplexDescription(e.target.value)}
                  placeholder="Descrierea complexului..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complex-image">URL Imagine</Label>
                <Input
                  id="complex-image"
                  value={newComplexImage}
                  onChange={(e) => setNewComplexImage(e.target.value)}
                  placeholder="https://exemplu.com/imagine.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission-type">Tip Comision</Label>
                <Select value={newComplexCommissionType} onValueChange={(value: 'fixed' | 'percentage') => setNewComplexCommissionType(value)}>
                  <SelectTrigger id="commission-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Procent (%)</SelectItem>
                    <SelectItem value="fixed">Fix (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission-value">Valoare Comision</Label>
                <Input
                  id="commission-value"
                  type="number"
                  step="0.01"
                  value={newComplexCommissionValue}
                  onChange={(e) => setNewComplexCommissionValue(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCreateComplexDialogOpen(false)} disabled={creatingComplex}>
                Anulează
              </Button>
              <Button onClick={handleCreateComplex} disabled={creatingComplex} className="gap-2">
                {creatingComplex ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Se creează...
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    Creează Complex
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
