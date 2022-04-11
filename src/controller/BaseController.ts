import express from 'express';

export default interface BaseController {
  createRoutes(): express.Router;
}
