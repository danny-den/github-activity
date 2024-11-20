# Github Activity
[![JSR Scope](https://jsr.io/badges/@dannyden)](https://jsr.io/@dannyden)
[![JSR](https://jsr.io/badges/@dannyden/github-activity)](https://jsr.io/@dannyden/github-activity)
[![JSR Score](https://jsr.io/badges/@dannyden/github-activity/score)](https://jsr.io/@dannyden/github-activity)  
Use GitHub API to fetch user activity and display it in the terminal.  


Project listed on [Roadmap.sh](https://roadmap.sh/projects/github-user-activity)

# Usage
<!-- usage -->
Using it with Deno
```
curl -fsSL https://deno.land/install.sh | sh

deno run jsr:@dannyden/github-activity kamranahmedse
```
Using it from PATH
```sh-session
$ github-activity kamranahmedse
✅ Granted net access to "api.github.com:443".
Is now watching coleam00/bolt.new-any-llm
Pushed 20 commit/s to kamranahmedse/developer-roadmap
Pushed 1 commit/s to kamranahmedse/awesome-minimal-sites
Made 5 pull request/s in kamranahmedse/developer-roadmap
Made 3 comment/s in kamranahmedse/developer-roadmap
```
Using it as dependecy
```
import githubActivity from "@dannyden/github-activity";

console.log(githubActivity("kamranahmedse")) // Creator of roadmap
```
<!-- usagestop -->

# Setup 
<!-- setup -->
Globally with Deno
```sh
echo "Run without installing it"
deno run jsr:@dannyden/github-activity kamranahmedse

echo "Install with permission checks"
deno install -g -n github-activity jsr:@dannyden/github-activity

echo "Install allowing net"
deno install -g -n github-activity --allow-net jsr:@dannyden/github-activity

echo "Uninstall"
deno uninstall -g github-activity
```

Locally as dependency
```sh
deno add jsr:@dannyden/github-activity
npx jsr add @dannyden/github-activity
yarn dlx jsr add @dannyden/github-activity
pnpm dlx jsr add @dannyden/github-activity
bunx jsr add @dannyden/github-activity
```

<!-- setupstop -->
