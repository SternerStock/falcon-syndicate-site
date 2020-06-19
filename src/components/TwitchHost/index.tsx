import React, { Component } from 'react'

interface TwitchChannel {
  id: number,
  login: string
}

interface TwitchHostProps {
  channels: string[]
}

interface TwitchHostState {
  parent: string,
  currentChannels: TwitchChannel[]
}

class TwitchHost extends Component<TwitchHostProps, TwitchHostState> {
  constructor(props: TwitchHostProps) {
    super(props)
    this.state = {
      parent: 'www.falconsyndicate.net',
      currentChannels: [
        {
          id: 53016301,
          login: 'sternerstock',
        },
      ],
    }
  }

  getLiveUsers() {
    const clientid = 'onz972wc4u448f1spty3i8qrm0mmfn'
    const urlBase = 'https://api.twitch.tv/helix/'
    let query = 'streams?'

    for (let i = 0; i < this.props.channels.length; i++) {
      if (i > 0) {
        query += '&'
      }

      query += 'user_login=' + this.props.channels[i]
    }

    fetch(urlBase + query, {
      headers: {
        'Client-ID': clientid,
      },
    }).then((response) =>
      response.json().then((streams) => {
        if (!streams || !streams.data) {
          return
        }

        let query = 'users?'
        for (let i = 0; i < streams.data.length; i++) {
          if (i > 0) {
            query += '&'
          }

          query += 'id=' + streams.data[i].user_id
        }

        fetch(urlBase + query, {
          headers: {
            'Client-ID': clientid,
          },
        }).then((response) =>
          response.json().then((users) => {
            if (users && users.data && users.data.length) {
              this.setState({
                currentChannels: [users.data[0]],
              })
            }
          })
        )
      })
    )
  }

  componentDidMount() {
    this.getLiveUsers()
    this.setState({
      parent: window.location.hostname
    })
  }

  render() {
    return (
      <div>
        {this.state.currentChannels.map((channel) => (
          <div key={channel.id} className="video-container video-container--hd">
            <iframe
              className="video-container__video"
              src={`https://player.twitch.tv/?channel=${channel.login}&parent=${this.state.parent}`}
              frameBorder="0"
              allowFullScreen={true}
              scrolling="no"
              height="378"
            ></iframe>
          </div>
        ))}
      </div>
    )
  }
}

export default TwitchHost
