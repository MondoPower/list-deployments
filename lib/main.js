"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const github = require('@actions/github');
const core = require('@actions/core');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github.context;
            const logUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;
            const token = core.getInput("token", { required: true });
            const environment = core.getInput("environment", { required: false }) || "production";
            const octokit = github.getOctokit(token);
            const query = `
    query($owner: String!, $repo: String!, $environment: String!) {
      repository(owner:$owner, name:$repo) {
        deployments(environments:$environment, first: 50, orderBy: {direction: DESC, field: CREATED_AT}) {
          edges {
            node {
              createdAt
              commit {
                oid
              }
              state
            }
          }
        }
      }
    }`;
            const variables = {
                owner: context.repo.owner,
                repo: context.repo.repo,
                environment: environment
            };
            const deployment = yield octokit.graphql(query, variables);
            console.log(deployment);
            core.setOutput("sha", "as");
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
run();
