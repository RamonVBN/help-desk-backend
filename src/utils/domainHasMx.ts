import dns from 'dns/promises'
import type {MxRecord} from 'dns'

export const domainHasMX = async (domain: string): Promise<MxRecord[]> => {
  try {
    const records = await dns.resolveMx(domain);
    return records;
  } catch {
    return [];
  }
};