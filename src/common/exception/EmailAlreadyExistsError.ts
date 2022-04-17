export default class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Organizer with email ${email} already exists!`);
  }
}
