const React = require('react')
const fs = require('fs')
const os = require('os')
const simpleGit = require('simple-git')

exports.Push = ({ insomniaContext: context }, { insomniaModels: models }) => {
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
        { type: 'submit', style: cssButtonYes, onClick: PushGit },
        'Push',
      ),
    )
  }

  async function PushGit() {
    var GitInit = new String()
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
    const dirTmp = os.tmpdir() + '\\' + models.workspace.name + '.json'

    if (!GitInit) {
      try {
        await fs.promises.mkdir(dirHome, { recursive: true })
      } catch (e) {
        console.error(e)
      }
    }

    try {
      await fs.promises.copyFile(
        dirTmp,
        dirHome + '\\' + models.workspace.name + '.json',
      )
    } catch (e) {
      console.error(e)
    }

    const git = simpleGit(dirHome)

    if (GitInit === 'false') {
      console.log('ehre')
      await git.init().then(
        (res) => {
          console.debug(res)
        },
        (err) => {
          console.error(err)
        },
      )
      await git.add('.').then(
        (res) => {
          console.debug(res)
        },
        (err) => {
          console.error(err)
        },
      )
      await git.commit('first commit !').then(
        (res) => {
          console.debug(res)
        },
        (err) => {
          console.error(err)
        },
      )
      await git.branch(['-M', 'master']).then(
        (res) => {
          console.debug(res)
        },
        (err) => {
          console.error(err)
        },
      )
      await git.addRemote('origin', urlItem).then(
        (res) => {
          console.debug(res)
        },
        (err) => {
          console.error(err)
        },
      )
      await git.push(['--set-upstream', 'origin', 'master']).then(
        (res) => {
          context.app.alert('Success', 'Push success')
        },
        (err) => {
          console.error(err)
        },
      )
      context.store.setItem('sync-git:init' + models.workspace.name, true)
    } else {
      await git.add('.').then(
        (res) => {
          console.debug(res)
        },
        (err) => {
          console.error(err)
        },
      )
      var now = new Date()
      var annee = now.getFullYear()
      var mois = now.getMonth() + 1
      var jour = now.getDate()
      var heure = now.getHours()
      var minute = now.getMinutes()
      var seconde = now.getSeconds()
      await git
        .commit(
          'commit ' +
            jour +
            '/' +
            mois +
            '/' +
            annee +
            ' ' +
            heure +
            ':' +
            minute +
            ':' +
            seconde,
        )
        .then(
          (res) => {
            console.debug(res)
          },
          (err) => {
            console.error(err)
          },
        )
      await git.push(['--set-upstream', 'origin', 'master']).then(
        (res) => {
          context.app.alert('Success', 'Push success')
        },
        (err) => {
          console.error(err)
        },
      )
    }
  }

  return form()
}
