---
layout: '../../layouts/PostLayout.astro'
title: 'Project Manifest'
description: 'Defines the concept of a project manifest.'
pubDate: 'Feb 01 2023'
heroImage: '/portfolio/architecture/manifest.jpeg'
---

It's a good idea for any project that has a release associated with it to include a project manifest json file at the root of the repository that specifies details about the project and its deployment.

_For API projects, the manifest content is made available via a `GET /manifest` endpoint for convenience._

## Manifest.json structure

| Field | Description  | Restrictions | Example |
| ---- | ---- | ---- | ---- |
| SCS | The 3 letter SCS code this project belongs to. | Length == 3 | `azr`|
| Name | The name of this project. Follow [resource based suffix naming conventions](/NPO-Development-Platform/Infrastructure/Resource-Naming-Conventions#user-content-name-%2F-usage). | Length > 3 and < 24 | `DotnetAPI: registration-api`<br/>`DotnetFunc: registration-func`<br/>`React: registration-web` |
| Description | A description of the project and its business domain. | Not null or whitespace| `The Azure Registration API owns the Azure tenant registration domain.` |
| Type | The project template  | Must be one of the supported template types.<br/><br/>`NPM, Nuget, React, DotnetAPI, DotnetFunc` | `DotnetAPI` |
| Version| The 2 letter project version. | Length == 2 | `01` |
| Region | The region this app should be deployed to. This value is an NPO Region Code, which will map to the Azure CLI codes. | Must be one of the supported [NPO Region Codes](/NPO-Development-Platform/Infrastructure/Resource-Naming-Conventions#user-content-region). | `cus` |
| Namespace | The .NET namespace for the project. _This only applies to .NET projects._ | Length > 10 | `Nonprofit.AzureRegistration.API` |
| AppRoles | A collection of application role definitions relating to this project. The project owns its own app roles which will be created on the Platform AAD app registration and assigned to the authorized services listed in the app role definition. | The app role name must begin with the project's ServiceId (`{Scs}-{Name}`) and follows the convention:<br/><br/>**`{AccessLevel}.{Resource}`**<br/>- Access Types: `Read, ReadWrite, Delete`<br/>- Resource: `All, {SubResource}`<br/><br/>The Authorized Services list must refer to valid ServiceIds. | **Name:**<br/>`azr-registration-api`<br/><br/>**AuthorizedServices:**<br/>`[ "npo-nonprofit-api", "adm-admin-api" ]` |

## Service Id

A project's **`ServiceId`** is a derived value of the form `{scs}-{name}` and is used to reference service deployments across the platform.

The `ServiceId` is used to specify another service when assigning app roles in your manifest.

## Example manifest.json

```
{
  "SCS": "azr",
  "Name": "registration-api",
  "Description": "The Azure Registration API owns the Azure tenant registration domain.",
  "Type": "DotnetAPI",
  "Version": "01",
  "Region": "cus",
  "Namespace": "Nonprofit.AzureRegistration.API",
  "AppRoles": [
    {
      "Name": "azr-registration-api.Read.All",
      "AuthorizedServices": [
        "npo-nonprofit-api"
      ]
    },
    {
      "Name": "azr-registration-api.ReadWrite.All",
      "AuthorizedServices": [
        "adm-admin-api"
      ]
    },
    {
      "Name": "azr-registration-api.Delete.All",
      "AuthorizedServices": [
        "adm-admin-api"
      ]
    }
  ]
}
```

# Usages

- Validated by pipelines via the `dev-cli project validate` command
- Used for resource and access control provisioning via the `dev-cli provision` commands
- Most properties are included in all logging and telemetry as custom dimensions
- Stored in the [service catalog](./service-catalog.md)

# Modifying AppRoles

Because identity tokens are [cached for around 24 hours](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations#limitation-of-using-managed-identities-for-authorization), any cached roles with continue to be used regardless of the updated assignments for the identity.

This means special care should be taken when modifying the app roles collection.

1. **Adding new app roles.** It is best to add the new app role a day before it will actually be required to be used so their assignments will propagate caches.
2. **Removing app roles.** In general, it is safe to remove an app role as the authorizing service will no longer be checking for the value.
3. **Renaming app roles.** This scenario requires special care and should be done in two steps to avoid outages:
   - _Add the renamed version of the role._ The authorizing app should allow access to both the old and new app roles for the time being.
   - _Remove the old role after a day._ Changes will propagate after a day, making it safe to remove the old app role.
