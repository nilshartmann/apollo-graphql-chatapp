# Bootstrap

In short:

* This is a **copy** of bootstrap (v4) and a **copy** of some of the reactstrap components
* We only use the [grid](https://getbootstrap.com/docs/4.0/layout/overview/) and [Reboot](https://getbootstrap.com/docs/4.0/getting-started/introduction/#reboot) from bootstrap

## Integration

* The bootstrap files from the bootstrap GitHub repository are copied to `src/layout/bootstrap`, to avoid
  npm depdencies to bootstrap (in order to make things easier)

* The `chat-app.scss` file include all SCSS files from bootstrap that are required for the
  grid and the reset file (called reboot in BS)

* The react components for the Grid (`Grid`, `Col` and `Row`) in this `src` folder are copies from the [reactstrap](https://github.com/reactstrap/reactstrap) project.
