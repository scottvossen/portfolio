---
layout: '../../layouts/PostLayout.astro'
title: 'Service Catalog'
description: 'Defines what the service catalog is and how it can be used.'
pubDate: 'Feb 01 2023'
heroImage: '/portfolio/architecture/service-catalog.jpg'
---

## Nonprofit Service Catalog

One of the disadvantages of breaking a monolith into microservices is an increase in complexity; the complexity of the system, difficulty in tracing and debugging, maintenance sprawl, and discoverability. The service catalog aims to tackle the drawback of discoverability in the system. We need to know what services are available, what regions they're deployed to, and what their dependencies are.

By storing and updating manifest files in a database during each deployment of a given service, we unlock the ability to aggregate and query our service catalog without relying on manually maintaining spreadsheets. The assumption here is that we would look to leverage a cosmos database's rich feature set.

### Implementation

The `p-cor-cosmos-cus-01` consumption based database manages platform related data. A `ServiceDocuments` collection is automatically populated with the `Manifest` documents from every service during deployment to the production environment.

### Discoverability Examples

- List all services in an SCS
- List all dependencies for a specific service
- Find all services which reference a given resource as a dependency

## Service Dependency Graphs

We can leverage the service catalog to build a service dependency graph for each of our services. This makes discovering the impact of a resource change or dependency much easier as the overall scale of the system increases.

### Visualization

- Automated tooling can be made to generate PUML or Mermaid diagrams for a given service on demand.
- We can also look into leveraging the [Gremlin API](https://docs.microsoft.com/en-us/azure/cosmos-db/graph/gremlin-support):
  - [VS Code Extension](https://github.com/Microsoft/vscode-cosmosdb#use-gremlin-to-query-graphs)
  - [Graph Visualization Partners](https://docs.microsoft.com/en-us/azure/cosmos-db/graph/graph-visualization-partners)
