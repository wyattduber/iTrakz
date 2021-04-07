import React, { Component } from "react";

class ActiveTickets extends Component {
    render() {
        return (
           <div class="row">
            <div class="col-5 active-tickets">
                <h3>Tickets</h3>
                <a href="tickets.html"><button class="btn btn-primary">View Tickets</button></a>
                <hr />

                <div class="row circles">
                    <div class="col">
                        <div class="circle">
                           2
                        </div>
                        <p class="circle-caption">New Tickets</p>
                    </div>
                    
                    <div class="col">
                        <div class="circle">
                            2
                        </div>
                        <p class="circle-caption">In Progress Tickets</p>
                    </div>
                </div>                
            </div>
        </div>
        );
    }
}

export default ActiveTickets;
