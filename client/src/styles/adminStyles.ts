export const adminStyles = ({isActive}: {isActive: boolean}) =>({
    height: 40,
    width: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "1px solid white",
    borderRight: "1px solid white",
    color: "white",
    textAlign: "center",
    lineHeight: "1.5em",
    backgroundColor: isActive? "grey":"inherit"
})