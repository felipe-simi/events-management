import controllers from './controller/controllers';
import { Server } from './Server';

const start = () => {
  const app = Server.getInstance();
  app.listen(controllers);
};

start();
