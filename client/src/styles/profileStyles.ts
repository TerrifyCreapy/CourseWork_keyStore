export const profileStyles = ({isActive}: {isActive: boolean}) =>({
    height: 70,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
    textAlign: "center",
    lineHeight: "1.5em",
    backgroundColor: isActive? "rgba(0,0,0, 0.2)" : "white",
    padding: "5px 10px 5px 10px"
})