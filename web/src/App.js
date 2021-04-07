import "./App.css";
import HomeTicketInfo from "./HomeTicketInfo";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import HomeHistoryInfo from "./HomeHistoryInfo";
import ActiveTickets from "./ActiveTickets";

function App() {
    return (
        <div className="App">
            <TopNav />
            <SideNav />
            <div class="container main-boxes">
                <div class="row">
                    <div class="col-5 ticket-dashboard">
                        <div class="support-tickets-header">
                            <h3>Support Tickets</h3>
                            <a href="submitTicket.html">
                                <button class="btn btn-primary">
                                    Create Ticket
                                </button>
                            </a>
                            <hr />
                        </div>
                        <HomeTicketInfo />
                        <HomeTicketInfo />
                        <HomeTicketInfo />
                    </div>

                    <div class="col-5 history-dashboard offset-1">
                        <h3>History</h3>
                        <hr />
                        <div class="history-nav">
                            <div class="row">
                                <div class="col-2 date">
                                    <p>Date</p>
                                </div>
                                <div class="col hist-description">
                                    <p>Description</p>
                                </div>
                                <div class="col-1 user">
                                    <p>User</p>
                                </div>
                            </div>
                        </div>

                        <div class="history-info">
                            <HomeHistoryInfo />
                            <HomeHistoryInfo />
                            <HomeHistoryInfo />
                            <HomeHistoryInfo />
                            <HomeHistoryInfo />
                        </div>
                    </div>
                </div>
                <ActiveTickets />
            </div>
        </div>
    );
}

export default App;
