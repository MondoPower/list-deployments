# deployment-action

A GitHub action to create [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

## Action inputs

| name             | description                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`          | GitHub token                                                                                                                                                                                                                                                                                                                                                                                                  |
| `environment`    | (Optional) The ref to deploy. This can be a branch, tag, or SHA. More details in the [GitHub deployments API](https://developer.github.com/v3/repos/deployments/#parameters-1). |

## Action outputs

| name            | description                                            			|
| --------------- | --------------------------------------------------------------- |
| `sha`           | The ID of the deployment as returned by the GitHub API 			|
| `refName`       | The Ref name that triggered the deployment                   	|
| `refPrefix`     | The Ref prefix (tags/heads/etc) that triggered the deployment 	|


## Example usage

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: MondoPower/list-deployments@v0.5.4
        id: listdeploy
        with:
          token: ${{ secrets.GITHUB_TOKEN }} 
          environment: ${{ github.event.inputs.promotefrom }}
		  
      - uses: chrnorm/deployment-action@releases/v1
        name: Create GitHub deployment
        id: deployment
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          environment: ${{ env.ENVIRONMENT }}
          ref: ${{ steps.listdeploy.outputs.sha }}
```
