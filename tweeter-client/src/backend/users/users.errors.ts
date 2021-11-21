export class HandleInUseError extends Error {
  status = 409;
}

export class HandleNotFoundError extends Error {
  status = 404;
}

export class HandleLacksEmailError extends Error {
  status = 500;
}
