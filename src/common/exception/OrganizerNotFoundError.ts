export default class OrganizerNotFoundError extends Error {
  constructor(id: string) {
    super(`Organizer with id ${id} not found!`);
  }
}
