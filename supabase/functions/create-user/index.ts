import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Creating Supabase admin client...')
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the requesting user is an admin
    console.log('Checking authorization...')
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }
    
    console.log('Creating auth client and getting user...')
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()
    
    if (userError) {
      console.error('Error getting user:', userError)
      throw new Error(`Authentication failed: ${userError.message}`)
    }
    
    if (!user) {
      console.error('No user found')
      throw new Error('User not found')
    }
    
    console.log('User authenticated:', user.email)

    // Check if user is admin
    console.log('Checking user role...')
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError) {
      console.error('Error checking role:', roleError)
      throw new Error(`Role check failed: ${roleError.message}`)
    }
    
    if (roleData?.role !== 'admin') {
      console.error('User is not admin:', roleData?.role)
      throw new Error('Only admins can create users')
    }
    
    console.log('User is admin, proceeding with user creation...')

    const { email, password, fullName, role } = await req.json()
    console.log('Creating user with email:', email)

    // Create the user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }
    
    console.log('User created successfully:', newUser.user.email)

    // Create profile
    console.log('Creating profile...')
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: email,
        full_name: fullName
      })
      
    if (profileError) {
      console.error('Error creating profile:', profileError)
      throw new Error(`Profile creation failed: ${profileError.message}`)
    }

    // Assign role
    console.log('Assigning role:', role)
    const { error: roleInsertError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: role
      })
      
    if (roleInsertError) {
      console.error('Error assigning role:', roleInsertError)
      throw new Error(`Role assignment failed: ${roleInsertError.message}`)
    }
    
    console.log('User creation completed successfully')

    return new Response(
      JSON.stringify({ success: true, user: newUser.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in create-user function:', errorMessage, error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
