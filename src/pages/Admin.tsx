import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface Complex {
  id: string;
  name: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedComplexes, setSelectedComplexes] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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

    try {
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
      toast.error('Eroare la actualizarea utilizatorului');
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

  if (authLoading || loading) {
    return <div>Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Administrare Utilizatori</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilizatori
            </CardTitle>
            <CardDescription>
              Gestionează rolurile și accesul utilizatorilor la complexe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        Editează
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editează utilizator</DialogTitle>
              <DialogDescription>
                Modifică rolul și accesul la complexe pentru {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
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

              {selectedRole !== 'admin' && (
                <div className="space-y-2">
                  <Label>Acces la complexe</Label>
                  <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                    {complexes.map((complex) => (
                      <div key={complex.id} className="flex items-center space-x-2">
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
                        <Label htmlFor={complex.id} className="cursor-pointer">
                          {complex.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={handleSaveUser}>Salvează</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
