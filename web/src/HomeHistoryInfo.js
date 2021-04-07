import React, { Component } from "react";

class HomeHistoryInfo extends Component {
    render() {
        return (
            <div class="row">
                <div class="col-2 date">
                    <p>Yesterday</p>
                </div>
                <div class="col hist-description">
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
                <div class="col-1 user">
                    <p>Admin</p>
                </div>
                <hr />
            </div>
        );
    }
}

export default HomeHistoryInfo;
