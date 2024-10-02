package utils

import (
	"server/models"
)

func isValid(matrix [][]int, row, col int, visited [][]bool) bool {
	return row >= 0 && row < len(matrix) && col >= 0 && col < len(matrix[0]) && !visited[row][col] && matrix[row][col] == 0
}

func depthFirstSearch(matrix [][]int, start models.Coordinates, end models.Coordinates, visited [][]bool, currPath []models.Coordinates, minLengthPath *[]models.Coordinates) {
	row, col := start.X, start.Y

	if row == end.X && col == end.Y {
		if len(*minLengthPath) == 0 || len(currPath) < len(*minLengthPath) {
			*minLengthPath = append([]models.Coordinates{}, currPath...)
		}
		return
	}

	visited[row][col] = true
	currPath = append(currPath, start)

	directions := []models.Coordinates{
		{X: 0, Y: 1},
		{X: 1, Y: 0},
		{X: 0, Y: -1},
		{X: -1, Y: 0},
	}

	for _, dir := range directions {
		newRow := row + dir.X
		newCol := col + dir.Y

		if isValid(matrix, newRow, newCol, visited) {
			depthFirstSearch(matrix, models.Coordinates{X: newRow, Y: newCol}, end, visited, currPath, minLengthPath)
		}
	}

	visited[row][col] = false
	currPath = currPath[:len(currPath)-1]
	if len(currPath) >= 0 {
		return
	}
}

func FindShortestPath(grid models.SelectedCoordinates) []models.Coordinates {
	matrix := make([][]int, grid.Rows)
	for i := range matrix {
		matrix[i] = make([]int, grid.Cols)
	}

	visited := make([][]bool, grid.Rows)
	for i := range visited {
		visited[i] = make([]bool, grid.Cols)
	}

	var minLengthPath []models.Coordinates

	startCoord := grid.Start
	endCoord := grid.End
	if startCoord == endCoord {
		return []models.Coordinates{startCoord}
	}

	depthFirstSearch(matrix, startCoord, endCoord, visited, []models.Coordinates{}, &minLengthPath)

	return minLengthPath
}
