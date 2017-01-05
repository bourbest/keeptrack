Definition de section cors dans le web.config
----------------------------------------------
 <configSections>
	 <section
        name="Web.CSRFProtection"
        type="Common.API.OWin.CSRFProtectionConfigurationSection"
        allowLocation="true"
        allowDefinition="Everywhere"
      />
 </configSections>


example de section :
---------------------------
    <Web.CSRFProtection cookieName="myCookie">
      <PathExceptions>
        <add name="oauth" value="/oauth" startsWith="true" />
        <add name="login" value="/login" />
      </PathExceptions>
    </Web.CSRFProtection>
