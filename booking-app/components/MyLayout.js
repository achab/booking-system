import ButtonAppBar from "./Header";

const layoutStyle = {
  margin: 10,
  padding: 10,
  border: "1px solid #DDD"
};

const Layout = props => (
  <div style={layoutStyle}>
    <ButtonAppBar />
    {props.children}
  </div>
);

export default Layout;
