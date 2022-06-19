import { AuthReq, Res } from "../../types";

const fetchRemote = async function (req: AuthReq, res: Res) {
  const user = req.user;

  const saves = await user.getSavedBuilds({
    include: ["buildFile"],
  });

  res.send(
    await Promise.all(
      saves.map((build) => ({
        id: build?.id,
        md5: build?.buildFile?.md5,
        url: "/files/" + build?.buildFile?.filename,
        name: build?.title,
        updatedAt: build.updatedAt,
      }))
    )
  );
};

export { fetchRemote };
