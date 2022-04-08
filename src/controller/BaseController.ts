import express from 'express';

export interface BaseController {
  createRoutes(): express.Router;
}
