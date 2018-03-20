# TODO

* Directives (formatted date)
* Scalar Type (date or id type?)
* Subscriptions (new Messages automatically published to Server)
* best way how to handle errors in server (i.e. channel or user with id not found)
* pagination / load more (messages in a channel?)

# QUESTIONS

* `proxy.readQuery` in `update` function after a Mutation is not typed?! (`variables` is `any`) (see Channel.tsx)
* `variables` in mutate options not typed?

# Resources

* Reusable GraphQL schema directives https://dev-blog.apollodata.com/reusable-graphql-schema-directives-131fb3a177d1
