function mySettings(props) {
  props.settings
  return (
    <Page>
      <Section title={<Text bold align="center">Dexcom Settings</Text>}>
        <Text align="center" bold>
          Dexcom Share Login
          </Text>
          <TextInput
            label="User Name"
            settingsKey="username"
          />
          <TextInput
            label="Password"
            settingsKey="password"
          />
        <Text>
    Just enter in your login information and the watch will automatically try to login. If you do not start seeing your data, try different login credentials.
        </Text>
      </Section>
    </Page>
);
}

registerSettingsPage(mySettings);