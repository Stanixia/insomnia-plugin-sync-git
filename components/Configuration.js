const React = require('react')

exports.Configuration = (
  { insomniaContext: context },
  { insomniaModels: models },
) => {
  var loginItem = new String()
  var urlItem = new String()

  var inlineStyles = {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  }
  var cssInput = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    padding: '7px',
    borderRadius: '3px',
    margin: '0',
    color: '#333333',
    marginTop: '15px',
  }
  var cssButton = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    padding: '7px',
    borderRadius: '3px',
    margin: '5px 0',
    color: '#333333',
    marginTop: '15px',
    textAlign: 'center',
  }

  async function form() {
    try {
      loginItem = await context.store.getItem('sync-git:login')
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
    return React.createElement(
      'form',
      {
        className: 'ConfigurationForm',
        style: inlineStyles,
      },
      React.createElement('input', {
        type: 'text',
        style: cssInput,
        placeholder: 'Personal access tokens (required)',
        defaultValue: loginItem,
        className: 'login',
      }),
      React.createElement('input', {
        type: 'text',
        style: cssInput,
        placeholder: 'URL (required)',
        className: 'url',
        defaultValue: urlItem,
      }),
      React.createElement(
        'button',
        { type: 'submit', style: cssButton, onClick: submitForm },
        'Submit',
      ),
    )
  }

  function submitForm() {
    const inputLogin = document.getElementsByClassName('login')[0].value
    const inputUrl = document.getElementsByClassName('url')[0].value
    context.store.setItem('sync-git:login', inputLogin)
    context.store.setItem('sync-git:url-' + models.workspace.name, inputUrl)
    context.store.setItem('sync-git:init' + models.workspace.name, false)
    context.app.alert('GitHub - Configuration', 'Settings saved')
  }

  return form()
}
