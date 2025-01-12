import { init, Applications } from '@kinde/management-api-js';
import { unstable_noStore as no_store } from 'next/cache';

export const getConnections = async () => {
  no_store();

  init();
  const { connections } = await Applications.getApplicationConnections({
    applicationId: '492c20f7b1b04427ab72b6b08eb6c763',
  });

  return connections;
};
