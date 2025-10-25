import { supabase } from '@/integrations/supabase/client';
import { complexes as staticComplexes } from '@/data/complexes';
import { eurocasa65gProperties } from '@/data/eurocasa65g-properties';
import { renewChiajnaProperties } from '@/data/renew-chiajna-properties';
import { initialProperties } from '@/data/initialProperties';

export const initializeDatabase = async () => {
  try {
    // Check if database is already initialized
    const { data: existingComplexes } = await supabase
      .from('complexes')
      .select('id')
      .limit(1);

    if (existingComplexes && existingComplexes.length > 0) {
      console.log('Database already initialized');
      return;
    }

    console.log('Initializing database...');

    // Insert complexes
    const { error: complexError } = await supabase
      .from('complexes')
      .insert(
        staticComplexes.map(complex => ({
          id: complex.id,
          name: complex.name,
          location: complex.location,
          description: complex.description,
          total_properties: complex.totalProperties,
          available_properties: complex.availableProperties,
          image: complex.image
        }))
      );

    if (complexError) throw complexError;

    // Insert properties for each complex
    const propertyMappings = [
      { complexId: 'complex-1', properties: initialProperties },
      { complexId: 'complex-2', properties: eurocasa65gProperties },
      { complexId: 'complex-3', properties: renewChiajnaProperties },
    ];

    for (const mapping of propertyMappings) {
      const propertiesData = mapping.properties.map(property => {
        const { id, ...data } = property;
        return {
          complex_id: mapping.complexId,
          data: data
        };
      });

      const { error: propError } = await supabase
        .from('properties')
        .insert(propertiesData);

      if (propError) throw propError;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
