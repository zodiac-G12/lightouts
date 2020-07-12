# Lights Out

- [Introductions](#Introductions)
- [Rules](#Rules)
- [Theories](#Theories)
- [Solver](#Solver)
- [Outlook](#Outlook)

## Introductions

`Lights Out` is a Puzzle Game.

## Rules

Goal: Make all cell the same color

1. The color of the pressed cell and the color of the cell above, below, left and right are reversed

2. It is passed through about the overflowed cells

3. Let's enjoy

## Theories

This game is depend on these theories:

1. Linear Algebra (Matrix)

2. Graph Theory

3. F2 Field

## Solver

Solver is `./src/modules/lightsout.ts`

Mechanizm: 

1. Create adjacency matrix E for each cell (Unweighted undirected graph) on F2 calculation

2. Create inverse matrix E^{-1} of adjacency matrix

3. E^{-1} * v (Current cells status) = answer vector (State of the cells to be pushed)

## Outlook

1. It is known that the existence of an inverse matrix is equivalent to the existence of a unique solution

2. In some cases there is no inverse matrix (ex. n=4,5,...)
