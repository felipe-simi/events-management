import Express from 'express';
import { ValidationError, validationResult } from 'express-validator/check';
import OrganizerBodyValidationMiddleware from '../middleware/OrganizerBodyValidationMiddleware';
import Organizer from '../model/Organizer';
import OrganizerDto from '../service/OrganizerDto';
import OrganizerService from '../service/OrganizerService';
import BaseController from './BaseController';

export class OrganizerController implements BaseController {
  private path = '/organizers';

  constructor(
    private organizerService: OrganizerService,
    private organizerValidation: OrganizerBodyValidationMiddleware
  ) {
    this.organizerService = organizerService;
    this.organizerValidation = organizerValidation;
  }

  createRoutes = (): Express.Router => {
    const router = Express.Router();
    router.post(
      this.path,
      this.organizerValidation.verifyCreateOrganizer(),
      this.create
    );
    return router;
  };

  create = (
    request: Express.Request<undefined, undefined, OrganizerDto>,
    response: Express.Response<OrganizerDto | { errors: ValidationError[] }>
  ): void | Express.Response => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).send({ errors: errors.array() });
    }
    const organizer = new Organizer(request.body.name);
    this.organizerService
      .save(organizer)
      .then(() =>
        response.status(201).json({ id: organizer.id, ...request.body })
      )
      .catch((error) => {
        console.error(error);
        return response.status(500).json();
      });
  };
}
