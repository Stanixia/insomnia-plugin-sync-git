const ReactDOM = require('react-dom')
const Configuration = require('./components/Configuration.js')
const Push = require('./components/Push')
const Pull = require('./components/Pull')
const fs = require('fs')
const os = require('os')

module.exports.workspaceActions = [
  {
    label: 'GitHub - Configuration',
    icon: 'fab fa-github',
    action: async (context, models) => {
      var style = {
        'margin-top': '10px',
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': 'space-between',
      }
      const root = document.createElement('div', { style: style })
      try {
        ReactDOM.render(
          await Configuration.Configuration(
            { insomniaContext: context },
            { insomniaModels: models },
          ),
          root,
        )
      } catch (e) {
        console.error(e)
      }
      context.app.dialog('GitHub - Configuration', root, {})
    },
  },
  {
    label: 'GitHub Pull',
    icon: 'fas fa-download',
    action: async (context, models) => {
      var style = {
        'margin-top': '10px',
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': 'space-between',
      }
      const root = document.createElement('div', { style: style })
      try {
        ReactDOM.render(
          await Pull.Pull(
            { insomniaContext: context },
            { insomniaModels: models },
          ),
          root,
        )
      } catch (e) {
        console.error(e)
      }
      context.app.dialog('GitHub - Pull', root, {})
    },
  },
  {
    label: 'GitHub Push',
    icon: 'fas fa-upload',
    action: async (context, models) => {
      const dirTmp = os.tmpdir()
      const ex = await context.data.export.insomnia({
        includePrivate: false,
        format: 'json',
        workspace: models.workspace,
      })

      fs.writeFileSync(
        dirTmp + '\\' + models.workspace.name + '.json',
        ex,
        (err) => {
          if (err) console.error(err)
        },
      )

      var style = {
        'margin-top': '10px',
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': 'space-between',
      }
      const root = document.createElement('div', { style: style })
      try {
        ReactDOM.render(
          await Push.Push(
            { insomniaContext: context },
            { insomniaModels: models },
          ),
          root,
        )
      } catch (e) {
        console.error(e)
      }
      context.app.dialog('GitHub - Push', root, {})
    },
  },
]
