import Express from 'express';
import { validationResult } from 'express-validator';
import EmailAlreadyExistsError from '../common/exception/EmailAlreadyExistsError';
import OrganizerBodyValidationMiddleware from '../middleware/OrganizerBodyValidationMiddleware';
import Organizer from '../model/Organizer';
import OrganizerDto from '../service/OrganizerDto';
import OrganizerService from '../service/OrganizerService';
import BaseController from './BaseController';
import FieldError from './error/FieldError';
import { fromValidationErrors, ResponseError } from './error/ResponseError';

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

  create = async (
    request: Express.Request<undefined, undefined, OrganizerDto>,
    response: Express.Response<OrganizerDto | ResponseError>
  ): Promise<void> => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const error = fromValidationErrors(validationErrors);
      response.status(422).send(error);
    } else {
      const organizer = new Organizer(request.body.name, request.body.email);
      try {
        await this.organizerService.save(organizer);
        response.status(201).json({ id: organizer.id, ...request.body });
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          const errors: FieldError[] = [
            {
              fieldName: 'email',
              value: organizer.email,
              message: error.message,
            },
          ];
          response.status(422).json({ errors });
        }
        console.error(error);
        response.status(500).json();
      }
    }
  };
}
