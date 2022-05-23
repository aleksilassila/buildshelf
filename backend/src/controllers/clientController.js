exports.fetchRemote = async function (req, res) {
  const user = req.user;

  const saves = await user.getSavedBuilds();

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
