export interface VCFContact {
  name: string;
  phone: string;
  email?: string;
  organization?: string;
}

export const parseVCF = (vcfContent: string): VCFContact[] => {
  const contacts: VCFContact[] = [];
  const vcards = vcfContent.split('END:VCARD');

  for (const vcard of vcards) {
    if (!vcard.trim() || !vcard.includes('BEGIN:VCARD')) continue;

    let name = '';
    let phone = '';
    let email = '';
    let organization = '';

    const lines = vcard.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Extract full name
      if (trimmedLine.startsWith('FN:')) {
        name = trimmedLine.substring(3).trim();
      }

      // Extract phone number (prioritize pref type)
      if (trimmedLine.includes('TEL') && trimmedLine.includes(':')) {
        const phoneMatch = trimmedLine.match(/:([\+\d\s\(\)]+)$/);
        if (phoneMatch && !phone) {
          phone = phoneMatch[1].trim();
        }
        // If this is a preferred number, override
        if (trimmedLine.includes('type=pref') && phoneMatch) {
          phone = phoneMatch[1].trim();
        }
      }

      // Extract email
      if (trimmedLine.startsWith('EMAIL') && trimmedLine.includes(':')) {
        const emailMatch = trimmedLine.match(/:(.+)$/);
        if (emailMatch) {
          email = emailMatch[1].trim();
        }
      }

      // Extract organization
      if (trimmedLine.startsWith('ORG:')) {
        organization = trimmedLine.substring(4).replace(/;/g, ' ').trim();
      }
    }

    // Only add contacts with at least a name and phone
    if (name && phone) {
      contacts.push({
        name,
        phone,
        email: email || undefined,
        organization: organization || undefined,
      });
    }
  }

  return contacts;
};
