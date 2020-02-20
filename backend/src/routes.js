import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/deliveries', DeliveryStatusController.index);
// Listar encomendas finalizadas
routes.get('/deliveryman/:id/deliveries', DeliveryStatusController.show);

routes.get('/deliveryman/:id/deliveries', DeliveryStatusController.index);
routes.put(
  '/deliveryman/:deliverymanID/deliveries/:id',
  DeliveryStatusController.update
);
routes.post('/files/signature', upload.single('file'), FileController.store);

routes.post('/delivery/:id/problem', DeliveryProblemController.store);

routes.use(authMiddleware);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.get('/deliverymans', DeliverymanController.index);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.delete('/delivery/:id', DeliveryController.delete);
routes.put('/delivery/:id', DeliveryController.update);

routes.get('/delivery/:id/problem', DeliveryProblemController.index);
// routes.get('delivery/problem', DeliveryProblemController.index);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

export default routes;
