const React = require('react')
const fs = require('fs')
const os = require('os')
const simpleGit = require('simple-git')
const rmfr = require('rmfr')

exports.Pull = ({ insomniaContext: context }, { insomniaModels: models }) => {
  var inlineStyles = {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  }
  var cssButtonYes = {
    backgroundColor: '#59a210',
    border: '1px solid #eee',
    padding: '7px',
    borderRadius: '3px',
    margin: '5px 0',
    color: '#eee',
    marginTop: '15px',
    textAlign: 'center',
  }
  var cssButtonNo = {
    backgroundColor: '#d04444',
    border: '1px solid #eee',
    padding: '7px',
    borderRadius: '3px',
    margin: '5px 0',
    color: '#eee',
    marginTop: '15px',
    textAlign: 'center',
  }

  async function form() {
    return React.createElement(
      'form',
      {
        className: 'ConfigurationForm',
        style: inlineStyles,
      },
      React.createElement(
        'button',
        { type: 'submit', style: cssButtonYes, onClick: PullGit },
        'Pull',
      ),
    )
  }

  async function PullGit() {
    var urlItem = new String()
    var loginItem = new String()
    try {
      GitInit = await context.store.getItem(
        'sync-git:init' + models.workspace.name,
      )
    } catch (e) {
      console.error(e)
    }
    try {
      urlItem = await context.store.getItem(
        'sync-git:url-' + models.workspace.name,
      )
    } catch (e) {
      console.error(e)
    }
    try {
      loginItem = await context.store.getItem('sync-git:login')
    } catch (e) {
      console.error(e)
    }

    urlItem = urlItem.replace(
      'https://',
      'https://' + encodeURIComponent(loginItem) + '@',
    )

    const dirHome = os.homedir() + '\\sync-git\\' + models.workspace.name

    if (fs.existsSync(dirHome)) {
      await rmfr(dirHome, { glob: true }).then(() => {
        fs.promises.mkdir(dirHome, { recursive: true }).then(() => {
          const git = simpleGit(dirHome)
          git.clone(urlItem, dirHome).then(() => {
            const data = fs.readFileSync(
              dirHome + '\\' + models.workspace.name + '.json',
            )
            context.data.import.raw(data.toString()).then(() => {
              context.app.alert('Update', 'Update success')
            })
          })
        })
      })
    } else {
      fs.promises.mkdir(dirHome, { recursive: true }).then(() => {
        const git = simpleGit(dirHome)
        git.clone(urlItem, dirHome).then(() => {
          const data = fs.readFileSync(
            dirHome + '\\' + models.workspace.name + '.json',
          )
          context.data.import.raw(data.toString()).then(() => {
            context.app.alert('Update', 'Update success')
          })
        })
      })
    }
  }

  return form()
}
