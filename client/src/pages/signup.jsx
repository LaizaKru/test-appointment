import React, { useState } from "react";
import {
  Page,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter,
  Link,
} from "framework7-react";
import store from "@/js/store";

export default () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const signUp = () => {
    store.dispatch("register", { login, password });
  };
  return (
    <Page noToolbar noNavbar noSwipeback loginScreen>
      <LoginScreenTitle>ClinicName</LoginScreenTitle>
      <List form>
        <ListInput
          label="Login"
          type="text"
          placeholder="Your login"
          value={login}
          onInput={(e) => {
            setLogin(e.target.value);
          }}
        />
        <ListInput
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onInput={(e) => {
            setPassword(e.target.value);
          }}
        />
      </List>
      <List inset>
        <ListButton onClick={signUp}>Зарегистрироваться</ListButton>
        <BlockFooter>
          Уже зарегистрированы? <Link href="/login/">Войти</Link>
        </BlockFooter>
      </List>
    </Page>
  );
};
