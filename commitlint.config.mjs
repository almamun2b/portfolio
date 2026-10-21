const config = {
  extends: ["@commitlint/config-conventional"],
  // Dependabot writes long generated bodies (release notes, commit lists)
  // that trip body-max-line-length; its titles are checked via its own
  // `commit-message` prefix in .github/dependabot.yml.
  ignores: [(message) => /^Signed-off-by: dependabot\[bot\]/m.test(message)],
};

export default config;
