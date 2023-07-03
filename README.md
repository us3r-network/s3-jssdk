# S3-JSSDK

S3-JSSDK is a library that allows you to manipulate data on the Ceramic network easily and securely.
It enables you to easily add user authentication, session management, and more to your dapp.

## Getting Started

To get started with S3-JSSDK for the Ceramic Network, simply install the package using npm:

```
npm install @us3r-network/auth @us3r-network/data-model @us3r-network/profile @us3r-network/link
```

Then, include the library in your project as needed:

```javascript
import { Us3rAuthProvider } from "@us3r-network/auth";
import { S3Model, S3ProfileModel, S3LinkModel } from "@us3r-network/data-model";
import { ProfileStateProvider } from "@us3r-network/profile";
import { LinkStateProvider } from "@us3r-network/link";
```


## Documentation

https://component-doc.s3.xyz

## Packages

|Package|Description|Version|
|  ----  |  ----  | ----  |
|  @us3r-network/auth  |  auth js sdk  | [![npm version](https://badge.fury.io/js/%40us3r-network%2Fauth.svg)](https://badge.fury.io/js/%40us3r-network%2Fauth)  |
|  @us3r-network/auth-with-rainbowkit  | auth with rainbowkit component  | [![npm version](https://badge.fury.io/js/%40us3r-network%2Fauth-with-rainbowkit.svg)](https://badge.fury.io/js/%40us3r-network%2Fauth-with-rainbowkit)  | 
|  @us3r-network/data-model  | data model js sdk & s3 preset models  | [![npm version](https://badge.fury.io/js/%40us3r-network%2Fdata-model.svg)](https://badge.fury.io/js/%40us3r-network%2Fdata-model)  | 
|  @us3r-network/profile  | profile components  | [![npm version](https://badge.fury.io/js/%40us3r-network%2Fprofile.svg)](https://badge.fury.io/js/%40us3r-network%2Fprofile)  |
|  @us3r-network/link  | link components  | [![npm version](https://badge.fury.io/js/%40us3r-network%2Flink.svg)](https://badge.fury.io/js/%40us3r-network%2Flink)  |
## Examples

- demo: <https://component-example.s3.xyz>
- source code: [GitHub repository](https://github.com/us3r-network/s3-jssdk/tree/example/packages/examples/link-collections)
- tutorial: <https://github.com/us3r-network/s3-jssdk/blob/example/packages/examples/link-collections/README.md>

## Contributing

Contributions to S3-JSSDK for the Ceramic Network are always welcome! If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/us3r-network/s3-jssdk/issues).

If you'd like to contribute code to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them.
4. Push the changes to your fork.
5. Submit a pull request to the main repository.

## License

S3-JSSDK for the Ceramic Network is released under the [MIT license](https://opensource.org/licenses/MIT).
