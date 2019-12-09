# Purpose

The purpose of the localhost-bt-dev.pfx is to allow the use of HTTPS when
testing azure http functions locally.  Looking at the Azure Function Core Tools
help, the `--useHttps` flag is supposed to generate and trust a new certificate
if none are specified.  It does indeed generate a cert, but it is not trusted.
Thus, web browsers and other clients complain about the certificate being invalid.

In addition, the generated cert is not cached.  A new one is generated every time
the tool is run.  This means that it isn't easy to simply allow the tool to generate
the cert and then trust it.  This may change as the Azure Functions Core Tools
continue to be updated and improved.  If this changes, then this cert can be
removed from the repo and the generated cert from the tooling can be used.

Since we want the development experience to be as close to production as possible,
we'll want to use https while developing.  In order to do so, simply trust
the `localhost-bt-dev.pfx` cert included in this folder.  Or generate your own
and use it (but do not commit the changes to the repo).

# PFX password

The default password is 'btdevcert' as specified in the `generatecert.sh` script.

# Generating your own cert

You may generate your own cert if you like and use it.  Please do not commit an
updated cert to the repo.  For your convenience, the `generatecert.sh` script is
available for this purpose.  It uses openssl, so it should work across all platforms.

NOTE: Some terminals (namely git bash on Windows) did not display the prompt
for the password when exporting to pfx.  Simply use a different terminal to
generate the cert.

# Trusting the cert

In order for your web browser to not complain about the cert being invalid, you
need to trust the cert in Windows and macOS.  There are several tutorials
on this topic to be found using google and is beyond the scope of this document.

# Running with Visual Studio

The project is already configured to pass the appropriate command line arguments
to the azure function command line interface when launching the project in debug
mode.  This is set in the launchsettings.json file.  It takes into account the
build output directory path when specifying the relative path of the .pfx file.

# Running with Azure Function Core Tools

If you're not using Visual Studio, you can launch the functions manually via the following
command while (cwd should have the built assemblies and assets of the .csproj):

`func host start --port 7071 --useHttps --cert <cert>.pfx --password <cert password>`

# Running with Visual Studio Code

If you're using VS Code, you should be able to modify your `tasks.json` file to
launch the Azure Function Core Tools using the same command as above:

`"command": 'func host start --port 7071 --useHttps --cert <cert>.pfx --password <cert password>'`

# Bypassing https

If your environment just doesn't want to cooperate, then simply change the
`launchsettings.json` to remove the `--useHttps` command line argument.  Then upate
the `appSettings.json` file in the `Client/public` folder to use http instead of
https.

Please do not commit those changes as the default development experience
should use https to be as close to production deployment as possible.