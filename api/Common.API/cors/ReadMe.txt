Definition de section cors dans le web.config
----------------------------------------------
<configSections>
  <section name="Web.Cors" type="Common.API.Cors.CorsConfigurationSection" allowLocation="true" allowDefinition="Everywhere" />
</configSections>

example de section Cors:
---------------------------
    <Web.Cors allowAnyHeader="true" allowAnyMethod="true" allowAnyOrigin="false" supportCredentials="true">
      <origins>
        <add name="ritm_pt" value="https://ritm-pt.com:8888" />
        <add name="ritm_dev" value="https://ritm-dev.com:8888" />
      </origins>
    </Web.Cors>
