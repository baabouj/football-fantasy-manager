import { handleAsync } from "../lib/handle-async";

import httpStatus from "http-status";
import { teamService } from "../services/team.service";
import { HttpError } from "../lib/http-error";

export const teamController = {
  find: handleAsync(
    async (req, res) => {
      const userId = req.user as string;
      const team = await teamService.find(userId);

      if (!team) throw new HttpError(httpStatus.NOT_FOUND, "Not Found");

      res.status(httpStatus.OK).send(team);
    },
    {
      isProtected: true,
    }
  ),
};
