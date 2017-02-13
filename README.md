# ember-cli-deploy-create-react-app

Simple, flexible deployment for your [create-react-app](https://github.com/facebookincubator/create-react-app) app

# Installation

```
yarn add ember-cli ember-cli-deploy ember-cli-deploy-create-react-app
```

# Config

In your create-react-app project's `config/deploy.js` file,

```
module.exports = function(deployTarget) {
	// ... other config ...

	if (deployTarget === 'production') {
		ENV['create-react-app'] = {
      publicURL: 'https://s3.amazonaws.com/your-bucket-name/your-app-name/'
    }
	}

  return ENV;
}
```