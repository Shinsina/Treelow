import React from 'react'
import {AuthConsumer} from './AuthContext'

const Header = () => (
    <header>
        <AuthConsumer>
            {({user, logOut}) => (
                <React.Fragment>
                    <a href={user.id ? `/${user.id}/boards` : `/`}>
                       <span role="img" aria-label="tree emoji">&#127795;</span> 
                    </a>
                    <h1>Treelow</h1>
                    <div className="user-area">
                    {user.id ? (
                    <React.Fragment>
                    <small>User: {user.email}</small>
                    <button onClick={(e) => logOut(e)}>Log Out</button>
                    </React.Fragment>
                    ): (<small>Please Sign In</small> )}
                    </div>
                </React.Fragment>
            )}
        </AuthConsumer>
    </header>
)

export default Header