package models

type SelectedCoordinates struct {
	Start     Coordinates   `json:"start"`
	End       Coordinates   `json:"end"`
	Cols      int           `json:"cols"`
	Rows      int           `json:"rows"`
	Obstacles []Coordinates `json:"obstacles"`
}

type Coordinates struct {
	X int `json:"x"`
	Y int `json:"y"`
}
