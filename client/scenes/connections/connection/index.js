import React, { Component } from 'react'
import { connect } from 'kea/logic'

import messg from 'messg'

import connectionsLogic from '~/scenes/connections/logic'

@connect({
  actions: [
    connectionsLogic, [
      'editConnection',
      'testConnection',
      'removeConnection'
    ]
  ]
})
export default class Connection extends Component {
  constructor (props) {
    super(props)

    this.state = {
      url: props.connection.url,
      structurePath: props.connection.structurePath,
      editing: false
    }
  }

  handleUpdate = (e) => {
    const { connection } = this.props
    const { editConnection } = this.props.actions
    const { url, structurePath } = this.state

    e.preventDefault()

    if (!url) {
      messg.error('You must enter a url', 2500)
      return
    }

    editConnection(connection._id, url, structurePath)

    this.setState({ editing: false })
  }

  handleCancel = () => {
    const { url, structurePath } = this.props.connection
    this.setState({ editing: false, url, structurePath })
  }

  handleEdit = (e) => {
    const { url, structurePath } = this.props.connection
    e.preventDefault()
    this.setState({ editing: true, url, structurePath })
  }

  handleRemove = (e, id) => {
    const { removeConnection } = this.props.actions
    e.preventDefault()
    if (window.confirm('Are you sure?')) {
      removeConnection(id)
    }
  }

  handleTest = (e, id) => {
    const { testConnection } = this.props.actions
    e.preventDefault()
    testConnection(id)
  }

  render () {
    const { connection } = this.props
    const { editing, url, structurePath } = this.state

    return (
      <div key={connection._id} style={{marginBottom: 20}}>
        <h3>{connection.keyword}</h3>
        {editing ? (
          <div>
            <br />
            <div style={{marginBottom: 10}}>
              <strong>connection url</strong>
              <br />
              <input placeholder='psql://user:pass@localhost/dbname' value={url} onChange={e => this.setState({ url: e.target.value })} className='input-text' style={{width: 400}} />
            </div>
            <div style={{marginBottom: 10}}>
              <strong>insights.yml path</strong>
              <br />
              <input placeholder='insights.yml path' value={structurePath} onChange={e => this.setState({ structurePath: e.target.value })} className='input-text' style={{width: 400}} />
            </div>
            <button type='button' onClick={this.handleUpdate}>Save</button>
            {' '}
            <button type='button' onClick={this.handleCancel} className='white'>Cancel</button>
          </div>
        ) : (
          <div>
            <div>
              connection url: {connection.url}
            </div>
            {connection.structurePath ? (
              <div>
                insights.yml path:
                {' '}
                {connection.structurePath}
              </div>
            ) : null}
            <br />
            Actions:
            {' '}
            <a href='#' onClick={(e) => this.handleRemove(e, connection._id)}>Remove</a>
            {' | '}
            <a href='#' onClick={this.handleEdit}>Edit</a>
            {' | '}
            <a href='#' onClick={(e) => this.handleTest(e, connection._id)}>Test connection</a>
          </div>
        )}
      </div>
    )
  }
}