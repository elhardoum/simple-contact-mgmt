import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Contacts from './contacts'
import ContactInfo from './contacts/Contact'
import EditContact from './contacts/Edit'
import AddContact from './contacts/Add'

import Header from './misc/Header'
import Error404 from './misc/Error404'

export default () => {
  return (
    <Router>
      <Header />

      <main className="w-full max-w-3xl mx-auto py-6 px-4">
        <Switch>
          <Route path="/" exact render={(props) => <Contacts {...props} />} />
          <Route
            path="/contacts"
            exact
            render={(props) => <Contacts {...props} />}
          />
          <Route
            path="/contacts/new"
            exact
            render={(props) => <AddContact {...props} />}
          />
          <Route
            path="/contacts/:id"
            exact
            render={(props) => <ContactInfo {...props} />}
          />
          <Route
            path="/contacts/edit/:id"
            exact
            render={(props) => <EditContact {...props} />}
          />
          <Route render={() => <Error404 />} />
        </Switch>
      </main>
    </Router>
  )
}
