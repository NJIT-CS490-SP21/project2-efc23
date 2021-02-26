import logo from './logo.svg';
import { useState, useRef, useEffect} from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection
var turn = 'X';
var player = " "
var player_id;
export function Board(props) {
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerBase, setPlayerBase] = useState([]);
  const [isNext, setIsNext] = useState(true);
  
    
  function Square({value, onClick}) {
  //
    return <div>
        <button class="box" onClick={onClick}>{value}</button>
      </div>;
  
  }
  
  function RenderSquare(props) {
    return ( <div>
  
    <Square 
      value={board[props.i]} 
      onClick={() => {
      
        var index = props.i;
        const nextBoard = board.slice();
        console.log("WHO???: " + isNext + " Player: " + player);
      
        if (player_id === 1 ){
          nextBoard[index] = 'X';
        
          setBoard(nextBoard);
          
        }else if(player_id === 2 ){
          nextBoard[index] = 'O';
           
          setBoard(nextBoard);
          
        }
        
        
        socket.emit('tic', { message: board, turn, index });
      }}/>

  </div>

    );
  }
  
  useEffect(() => {
    
    socket.on('name', (name_arr) => {
      console.log('YA boy is here');
      console.log(name_arr);
      
      setPlayerBase(name_arr);
      console.log("PlayerBase = " + playerBase);
    });
    
    socket.on(props.message, ([playerType, data]) => {
      console.log('Player ' + playerType + 'is here');
      console.log(data, playerType);
      
      if (playerType == 1){
        player_id = 1;
        player = "Player 1";
      }else if (playerType == 2){
        player_id = 2;
        player = "Player 2";
      }else {
        player_id = 3;
        player = "Spectator";
      }
      
    });
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('tic', (data) => {
      console.log('Player event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.\\
    
      setBoard(prevBoard => {
        const nextBoard = prevBoard.slice();
        
        if (player_id === 1){
          nextBoard[data.index] = 'O';
          
        }else if(player_id === 2 ){
          nextBoard[data.index] = 'X';
          
        }
       
        return nextBoard;
      });
       
    });
  }, []);
  
  return ( <div>
  <h1>Hello {player} {props.message}!</h1>
  <p1>Lobby: </p1>
  <ul>
    { playerBase.map((item, index) => <div>{playerBase[index]}</div> )}
  </ul>
      <div class="board">
       <RenderSquare i="1" />
       <RenderSquare i="2" />
       <RenderSquare i="3" />
       <RenderSquare i="4" />
       <RenderSquare i="5" />
       <RenderSquare i="6" />
       <RenderSquare i="7" />
       <RenderSquare i="8" />
       <RenderSquare i="9" />
      </div>
     </div>    
     );
  
}

export default Board;
      





