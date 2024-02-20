import React from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button
} from 'framework7-react';

const HomePage = () => (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar sliding={false}>
      <NavTitle sliding>ClinicName</NavTitle>
    </Navbar>
    {/* Page content */}
    <Block>
      <p>
          Добро пожаловать в нашу клинику! Мы предлагаем широкий спектр медицинских услуг.
      </p>
        <Block>
            <Button href='/appointment/' large tonal>Записаться на прием</Button>
        </Block>
    </Block>
  </Page>
);
export default HomePage;
