export default class OrganizerNotFound extends Error {
  constructor(id: string) {
    super(`Organizer with id ${id} not found!`);
  }
}
