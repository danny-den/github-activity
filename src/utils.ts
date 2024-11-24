import mod from "../deno.json" with { "type": "json" };
// Roadmap requirements wants us to avoid using dependencies at least for this project
// See this for a better way: @std/cli/parse-args
export const parseFlags = () => {
  const joinedArgs = Deno.args.join("|");
  const hasHelpFlag = joinedArgs.match(/--help|-h/)?.length;
  if (hasHelpFlag) {
    console.log(help());
    Deno.exit();
  }
  const hasVersionFlag = joinedArgs.match(/--version|-v/)?.length;
  if (hasVersionFlag) {
    console.log(version());
    Deno.exit();
  }
};

const help = () =>
  `github-activity: Use GitHub API to fetch user activity and display it in the terminal
Read more: https://roadmap.sh/projects/github-user-activity

Usage: deno [OPTIONS] [USERNAME]

Arguments:
  [USERNAME]  A github username

Options:
  -h, --help          Shows this help message
  -v, --version       Shows github-activity version
`;

const version = () => {
  const version: string[][] = [];
  if (Deno !== undefined) version.push(...Object.entries(Deno.version));
  const modVersion = ["githubActivity", mod.version];
  version.push(modVersion);
  return version.join("\n");
};
